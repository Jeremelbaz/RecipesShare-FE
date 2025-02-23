import apiClient, { CanceledError } from "./api-client"

import { PostData } from "../components/Post/Post"

export { CanceledError }
const getAllPosts = () => {
    const abortController = new AbortController()
    const req = apiClient.get<PostData[]>('recipespost', { signal: abortController.signal })
    return { req, abort: () => abortController.abort() }

}

export default { getAllPosts }