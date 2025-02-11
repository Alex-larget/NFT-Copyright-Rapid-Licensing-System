import request from '@/utils/request'
import { OriginalNft, ChildNft, CopyrightType } from '@/types/nft'

export const getNftList = () => {
  return request.get<{ list: OriginalNft[] }>('/original-nfts', {
    params: {
      page: 1,
      pageSize: 10
    }
  })
}

export const getChildNftList = () => {
  return request.get<{ list: ChildNft[] }>('/child-nfts', {
    params: {
      page: 1,
      pageSize: 10
    }
  })
}

export const createNft = (data: {
  name: string
  description: string
  cover: string
  copyrightType: CopyrightType
  maxCount: number
}) => {
  return request.post<OriginalNft>('/nfts', data)
}

export const getNftDetail = (id: string) => {
  return request.get<OriginalNft | ChildNft>(`/nfts/${id}`)
} 