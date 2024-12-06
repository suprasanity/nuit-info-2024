// File: src/service/ApiService.ts
import axios from 'axios';

export class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async post(endpoint: string, data: FormData) {
        const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async get(endpoint: string) {
        const response = await axios.get(`${this.baseUrl}${endpoint}`);
        return response.data;
    }
}