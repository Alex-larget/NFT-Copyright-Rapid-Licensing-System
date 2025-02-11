import request from '@/utils/request'
import { OriginalNft } from '@/types/nft'

export interface HomeData {
  featuredNfts: OriginalNft[]
  latestNfts: OriginalNft[]
  totalNftCount: number
}

export const getHomePageData = () => {
  return request.get<HomeData>('/home/data', {
    params: {
      featuredCount: 6,
      latestCount: 6
    }
  })
} 