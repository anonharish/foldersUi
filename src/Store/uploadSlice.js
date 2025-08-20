// uploadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showAddFolderModal: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setShowAddFolderModal: (state, action) => {
      state.showAddFolderModal = action.payload;
    },
  },
});

export const {
 setShowAddFolderModal
} = uploadSlice.actions;

export default uploadSlice.reducer;