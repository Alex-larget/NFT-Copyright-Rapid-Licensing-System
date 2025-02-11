import Mock from 'mockjs'
import { OriginalNft, CopyrightType, NftStatus } from '@/types/nft'

const generateNftList = (count = 6): OriginalNft[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.mock('@guid'),
    name: Mock.mock('@ctitle(5, 10)'),
    description: Mock.mock('@cparagraph(1, 3)'),
    cover: Mock.mock('@image("400x400", "#50B347", "#FFF", "NFT")'),
    creator: Mock.mock('@name'),
    creatorAvatar: Mock.mock('@avatar'),
    type: CopyrightType.ORIGINAL,
    status: NftStatus.ON_SALE,
    maxCount: Mock.mock('@integer(10, 1000)'),
    currentCount: Mock.mock('@integer(1, 10)')
  }))
}

Mock.mock('/home/data', 'get', {
  code: 200,
  message: '获取成功',
  featuredNfts: generateNftList(6),
  latestNfts: generateNftList(6),
  totalNftCount: Mock.mock('@integer(100, 10000)')
}) 