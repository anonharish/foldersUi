import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    folderPath: [],
}

const breadcrumbSlice = createSlice({
    name: "breadcrumb",
    initialState,
    reducers: {
        setFolderPath: (state, action) => {
            state.folderPath = action.payload
        },
        addFolderToPath: (state, action) => {
            state.folderPath.push(action.payload)
        },
        resetFolderPath: (state) => {
            state.folderPath = []
        }
    }
});
export const { setFolderPath, resetFolderPath, addFolderToPath } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;