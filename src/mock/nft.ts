import Mock from 'mockjs'
import { OriginalNft, ChildNft, CopyrightType, NftStatus, TradeType } from '@/types/nft'

// 生成 NFT 列表模拟数据
const generateNftList = (count = 10): OriginalNft[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: Mock.mock('@guid'),
    name: Mock.mock('@ctitle(5, 10)'),
    description: Mock.mock('@cparagraph(1, 3)'),
    cover: Mock.mock('@image("250x250", "#50B347", "#FFF", "NFT")'),
    creator: Mock.mock('@name'),
    creatorAvatar: Mock.mock('@avatar'),
    type: CopyrightType.ORIGINAL,
    status: NftStatus.ON_SALE,
    maxCount: Mock.mock('@integer(10, 1000)'),
    currentCount: Mock.mock('@integer(1, 10)')
  }))
}

// 模拟获取 NFT 列表
Mock.mock('/original-nfts', 'get', {
  code: 200,
  message: '获取成功',
  'list': generateNftList()
})

// 模拟子藏品数据
Mock.mock('/api/child-nfts', 'get', {
  'list|20': [{
    'id|+1': 1,
    'originalNftId|1-10': 1,
    'name': '@ctitle(5,10)',
    'description': '@cparagraph(1,3)',
    'authorizeScope|1-3': ['@word'],
    'validityPeriod|1-10': 1,
    'type': CopyrightType.CHILD,
    'status|1': Object.values(NftStatus),
    'price|100-10000.2': 1
  }]
})

export default Mock 