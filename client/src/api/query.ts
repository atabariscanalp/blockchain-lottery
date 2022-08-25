import { AxiosPromise } from 'axios'
import { useState } from "react";

type queryProp = (data: any) => AxiosPromise | Promise<any>

export default function Query<T>(query: queryProp) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null as any)
  const [didFetch, setDidFetch] = useState(false)
  const [data, setData] = useState<T|null>(null)

  const fetch = async (data?: Parameters<typeof query>[0]) => {
    setData(null)
    setError(null)
    setLoading(true)
    let response
    try {
      response = await query(data).then((axiosResponse) => axiosResponse)
      setData(response)
    } catch (error) {
      const errorResponse = (error as any).response
      if (errorResponse) {
        setError(errorResponse.data.code)
      } else {
        setError(error)
      }
    }
    setDidFetch(true)
    setLoading(false)
    if (error) {
      throw error
    }
    return response
  }

  const resetState = () => {
    setData(null)
    setError(null)
    setLoading(false)
    setDidFetch(false)
  }

  return {
    fetch,
    resetState,
    loading,
    error,
    didFetch,
    data,
  }
}
