import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    folderPath: [],
    activeFolder: null,
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
            state.folderPath = [];
            state.activeFolder= null;
        },
        setActiveFolder: (state, action) => {
            state.activeFolder = action.payload
        }
    }
});
export const { setFolderPath, resetFolderPath, addFolderToPath, setActiveFolder } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;