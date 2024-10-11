import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
import os

# 創建 FastAPI 應用
app = FastAPI()

# 定義允許的 CORS 來源
origins = [
    "http://localhost:5173",  # 你的前端應用所運行的來源
]

# 加入 CORS 中介軟體
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 允許的來源
    allow_credentials=True,
    allow_methods=["*"],  # 允許的 HTTP 方法 (GET, POST, DELETE 等)
    allow_headers=["*"],  # 允許的 HTTP 標頭
)


# 定義電影資料的格式
class Movie(BaseModel):
    id: int
    original_title: str
    title: str
    release_date: str
    vote_average: float
    overview: str
    poster_path: str


# 定義使用者資料的格式
class User(BaseModel):
    user_name: str
    password: str


# 定義存放使用者和收藏的檔案路徑
USER_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data/user.json")
FAVORITES_FILE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "data/favorites.json"
)

# 初始化時確保檔案存在，如果不存在則創建
for file_path in [USER_FILE, FAVORITES_FILE]:
    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w") as f:
            json.dump([], f)


# 從檔案讀取使用者資料
def load_users():
    try:
        with open(USER_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


# 將使用者資料寫回檔案
def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, ensure_ascii=False, indent=4)


# 從檔案讀取收藏的電影列表
def load_favorites():
    try:
        with open(FAVORITES_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


# 將更新的收藏電影列表寫回檔案
def save_favorites(favorites):
    with open(FAVORITES_FILE, "w") as f:
        json.dump(favorites, f, ensure_ascii=False, indent=4)


# 使用者註冊
@app.post("/user/signup")
def signup(user: User):
    users = load_users()
    # 檢查是否用戶名已經存在
    for existing_user in users:
        if existing_user["user_name"] == user.user_name:
            return {"status": 400, "message": "使用者名稱已存在，請重試"}

    users.append(user.dict())
    save_users(users)

    return {"status": 200, "message": "註冊成功", "results": user}


# 使用者登入
@app.post("/user/login")
def login(user: User):
    users = load_users()
    for existing_user in users:
        if (
            existing_user["user_name"] == user.user_name
            and existing_user["password"] == user.password
        ):
            return {"status": 200, "message": "登入成功", "results": existing_user}

    return {"status": 400, "message": "登入失敗，請重試"}


# 加入電影到收藏
@app.post("/favorites/{username}")
def add_to_favorites(username: str, movie: Movie):
    favorites = load_favorites()

    # 查找該使用者的收藏
    user_favorites = next((f for f in favorites if f["user_name"] == username), None)

    if user_favorites:
        # 檢查該電影是否已存在該用戶的收藏
        for favorite_movie in user_favorites["movies"]:
            if favorite_movie["id"] == movie.id:
                return {"status": 400, "message": "該電影已存在你的收藏中"}

        # 添加電影到收藏
        user_favorites["movies"].append(movie.dict())
    else:
        # 如果該使用者沒有收藏記錄，則創建新記錄
        favorites.append({"user_name": username, "movies": [movie.dict()]})

    save_favorites(favorites)
    return {"status": 200, "message": "成功加入至我的收藏"}


# 獲取收藏的電影列表
@app.get("/favorites/{username}", response_model=List[Movie])
def get_favorites(username: str):
    favorites = load_favorites()
    user_favorites = next((f for f in favorites if f["user_name"] == username), None)

    if user_favorites:
        return user_favorites["movies"]
    return []


# 刪除收藏中的電影
@app.delete("/favorites/{username}/{movie_id}")
def remove_from_favorites(username: str, movie_id: int):
    favorites = load_favorites()
    user_favorites = next((f for f in favorites if f["user_name"] == username), None)

    if not user_favorites:
        return {"status": 400, "message": "沒有找到該使用者的收藏"}

    user_favorites["movies"] = [
        movie for movie in user_favorites["movies"] if movie["id"] != movie_id
    ]
    save_favorites(favorites)
    return {"status": 200, "message": "已成功從我的收藏移除"}


if __name__ == "__main__":
    print("Server is running on 8080...")
    uvicorn.run("index:app", host="127.0.0.1", port=8000, reload=True)
