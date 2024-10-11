import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user_name: "", status: "" },
  reducers: {
    setUserInfo(state, action) {
      state.user_name = action.payload.user_name;
      state.status = action.payload.status;
    },
    logout(state) {
      state.user_name = "";
      state.status = "";
    },
  },
});

export const userLogin = (userData) => {
  return async (dispatch) => {
    const sendLoginRequest = async (userData) => {
      const response = await fetch("http://127.0.0.1:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("登入失敗");
      }

      const data = await response.json();
      return data;
    };

    try {
      const data = await sendLoginRequest(userData);
      if (data.status === 200) {
        dispatch(
          userAction.setUserInfo({
            user_name: data.results.user_name,
            status: data.message,
          })
        );
      } else {
        dispatch(
          userAction.setUserInfo({
            status: data.message,
          })
        );
      }
    } catch (error) {
      dispatch(
        userAction.setUserInfo({
          status: error.message,
        })
      );
    }
  };
};

export const userSignUp = (userData) => {
  return async (dispatch) => {
    const sendSignUpRequest = async (userData) => {
      const response = await fetch("http://127.0.0.1:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("註冊失敗");
      }

      const data = await response.json();
      return data;
    };

    try {
      const data = await sendSignUpRequest(userData);
      if (data.status === 200) {
        dispatch(
          userAction.setUserInfo({
            user_name: data.results.user_name,
            status: data.message,
          })
        );
      } else {
        dispatch(
          userAction.setUserInfo({
            status: data.message,
          })
        );
      }
    } catch (error) {
      dispatch(userAction.setUserInfo({ status: error.message }));
    }
  };
};

export const userAction = userSlice.actions;

export default userSlice;
