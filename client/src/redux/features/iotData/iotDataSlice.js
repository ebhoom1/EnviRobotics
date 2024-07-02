import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../utils/apiConfig';

// Thunk to fetch the latest IoT data
export const fetchLatestIotData = createAsyncThunk(
  'iotData/fetchLatestIotData',
  async (userName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/latest-iot-data/${userName}`);
      return response.data.data[0] || {};
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: 'An unknown error occurred' });
    }
  }
);

// Thunk to fetch IoT data by user name
export const fetchIotDataByUserName = createAsyncThunk(
  'iotData/fetchIotDataByUserName',
  async (userName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/get-IoT-Data-by-userName/${userName}`);
      const data = response.data.data;

      if (!data || data.length === 0) {
        return rejectWithValue({ message: `No data found for ${userName}` });
      }

      const latestEntry = data.reduce((latest, current) => (
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
      ), data[0]);

      return latestEntry || { message: `No data found for ${userName}` };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: 'An unknown error occurred' });
    }
  }
);

// Thunk to fetch average data by user name
export const fetchAverageDataByUserName = createAsyncThunk(
  'iotData/fetchAverageDataByUserName',
  async ({ userName, interval }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/averageData/${userName}?interval=${interval}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: 'An unknown error occurred' });
    }
  }
);

// Thunk to fetch difference data by user name
export const fetchDifferenceDataByUserName = createAsyncThunk(
  'iotData/fetchDifferenceDataByUserName',
  async (userName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/differenceData/${userName}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: 'An unknown error occurred' });
    }
  }
);

const iotDataSlice = createSlice({
  name: 'iotData',
  initialState: {
    latestData: {},
    userIotData: {},
    averageData: [],
    differenceData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Latest IoT Data
      .addCase(fetchLatestIotData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestIotData.fulfilled, (state, action) => {
        state.loading = false;
        state.latestData = action.payload;
      })
      .addCase(fetchLatestIotData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch IoT Data by User Name
      .addCase(fetchIotDataByUserName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIotDataByUserName.fulfilled, (state, action) => {
        state.loading = false;
        state.userIotData = action.payload;
      })
      .addCase(fetchIotDataByUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Average Data by User Name
      .addCase(fetchAverageDataByUserName.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAverageDataByUserName.fulfilled, (state, action) => {
        state.loading = false;
        state.averageData = action.payload;
      })
      .addCase(fetchAverageDataByUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Difference Data by User Name
      .addCase(fetchDifferenceDataByUserName.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDifferenceDataByUserName.fulfilled, (state, action) => {
        state.loading = false;
        state.differenceData = action.payload;
      })
      .addCase(fetchDifferenceDataByUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default iotDataSlice.reducer;
