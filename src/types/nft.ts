// 版权类型枚举
export enum CopyrightType {
  ORIGINAL = 'original',
  CHILD = 'child'
}

// 交易类型枚举
export enum TradeType {
  TRANSFER = 'transfer',
  AUTHORIZE = 'authorize'
}

// 藏品状态枚举
export enum NftStatus {
  ON_SALE = 'on_sale',
  SOLD = 'sold',
  AUTHORIZED = 'authorized'
}

export interface BaseNft {
  id: string
  name: string
  description: string
  cover: string
  creator: string
  creatorAvatar: string
  status: NftStatus
}

export interface OriginalNft extends BaseNft {
  type: CopyrightType.ORIGINAL
  maxCount: number
  currentCount: number
}

export interface ChildNft extends BaseNft {
  type: CopyrightType.CHILD
  originalNftId: string
  price: number
}

// 用户接口
export interface User {
  id: string
  username: string
  avatar: string
  wallet: string
  nfts: (OriginalNft | ChildNft)[]
} 