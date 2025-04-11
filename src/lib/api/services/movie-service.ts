import { ApiResponse, Movie } from "../types";
import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";

class MovieService {
  async getMovies() {
    const response = await axiosInstance.get<ApiResponse<string, { movies: Movie[] }>>(
      API_ENDPOINTS.MOVIES.BASE
    );
    return response.data;
  }

  async getMovie(id: string) {
    const response = await axiosInstance.get<ApiResponse<string, { movie: Movie }>>(
      API_ENDPOINTS.MOVIES.DETAIL(id)
    );
    return response.data;
  }

  async getNewestMovies() {
    const response = await axiosInstance.get<ApiResponse<string, { movies: Movie[] }>>(
      API_ENDPOINTS.MOVIES.NEWEST
    );
    return response.data;
  }

  async createMovie(data: Partial<Movie>) {
    const response = await axiosInstance.post<ApiResponse<string, { movie: Movie }>>(
      API_ENDPOINTS.MOVIES.BASE,
      data
    );
    return response.data;
  }

  async updateMovie(id: string, data: Partial<Movie>) {
    const response = await axiosInstance.put<ApiResponse<string, { movie: Movie }>>(
      API_ENDPOINTS.MOVIES.UPDATE(id),
      data
    );
    return response.data;
  }

  async deleteMovie(id: string) {
    const response = await axiosInstance.delete<ApiResponse<string, null>>(
      API_ENDPOINTS.MOVIES.DELETE(id)
    );
    return response.data;
  }
}

const movieService = new MovieService();
export default movieService;