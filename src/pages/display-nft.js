import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { tokenaddress } from '../config';
import Token from '../Token.json'

function Display() {
    const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/12c36cfbdd209707bb91d9a7/bsc/testnet")
    const tokenContract = new ethers.Contract(tokenaddress, Token.abi, provider)
    const data = await tokenContract.getTokenData()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let item = {
        tokenId: i.tokenId.toNumber(),
        image: meta.data.image,
        name: meta.data.name,
        price: meta.data.price,
        addressOwner: meta.data.addressOwner,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }



  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="header">No NFT</h1>)
  return (
    <div className="box">
      <div className="boxx">
        <div className="boxy">
          {
            nfts.map((nft, i) => (
              <div key={i} className="boxz">
                <div className="img">
                  <img src={nft.image} />
                </div>
                <div className="boxc">
                  <p className="para">Name - {nft.name}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Display