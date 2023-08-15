import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    editNotification(state, action) {
      return action.payload
    },
  },
})

export const notificationChange = (notification) => {
  return {
    type: 'notification/editNotification',
    payload: notification,
  }
}

export const { editNotification } = notificationSlice.actions
export default notificationSlice.reducer
