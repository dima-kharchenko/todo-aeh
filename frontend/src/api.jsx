import axios from "axios";

const API_URL = "/api/"
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const signup = async (username, password) => {
    const response = await api.post("user/register/", {
        username: username,
        password: password,
    })

    return response.data
}

export const login = async (username, password) => {
    const response = await api.post("token/", {
        username: username,
        password: password
    })

    return response.data
}

export const logout = async () => {
    try {
        const response = await api.get("user/logout/");
        return response.data
    } catch (err) {
        console.error(err)
        return null
    }
};

export const checkAuth = async () => {
    const response = await api.post("user/status/")
    return response.data
}

export const createTask = async (task) => {
    const response = await api.post("task/create/", task)
    return response.data
}

export const updateTask = async (task) => {
    const response = await api.put("task/update/", task)
    return response.data
}

export const deleteTask = async (id) => {
    const response = await api.delete("task/delete/", { data: { id: id } })
    return response.data
}

export const getTasks = async () => {
    const response = await api.get("tasks/", { params: {} })
    return response.data
}

