import {createSlice} from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
    name: "authentication",
    initialState: {
        isUserLogin: false,
        isAdminLogin: false,
        isStaffLogin: false,
        adminToken: null,
        userToken: null,
        staffId: null
    },
    reducers: {
        loginUser(state, action) {
            state.isUserLogin = true;
            state.isAdminLogin = false;
            state.isStaffLogin = false;
            state.adminToken = null;
            state.staffId = null;
            state.userToken = action.payload.userToken;
        },
        logoutUser(state, action) {
            state.isUserLogin = false;
            state.isAdminLogin = false;
            state.isStaffLogin = false;
            state.adminToken = null;
            state.userToken = null;
            state.staffId = null;
        },
        loginAdmin(state, action) {
            state.isUserLogin = false;
            state.isAdminLogin = true;
            state.isStaffLogin = false;
            state.adminToken = action.payload.adminToken;
            state.userToken = null;
            state.staffId = null;
        },
        logoutAdmin(state, action) {
            state.isUserLogin = false;
            state.isAdminLogin = false;
            state.isStaffLogin = false;
            state.adminToken = null;
            state.userToken = null;
            state.staffId = null;
        },
        loginStaff(state, action) {
            state.isUserLogin = false;
            state.isStaffLogin = true;
            state.isAdminLogin = false;
            state.adminToken = null;
            state.userToken = null;
            state.staffId = action.payload.staffId;
        },
        logoutStaff(state, action) {
            state.isUserLogin = false;
            state.isAdminLogin = false;
            state.isStaffLogin = false;
            state.adminToken = null;
            state.userToken = null;
            state.staffId = null;
        }
    }
});

export const authActions = authenticationSlice.actions;
export default authenticationSlice;