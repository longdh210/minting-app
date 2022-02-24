import { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import pinJSONToIPFS from '../api/pinata';
import { useNavigate } from 'react-router-dom';

import { tokenaddress } from '../config';
import Token from '../Token.json'

const clientInfura = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


function Mint() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ name:'', description: '', price: '', addressOwner: '' })
    const navigate = useNavigate()
    
    const onChange = async (e) => {
        const file = e.target.files[0]
        try {
            const added = await clientInfura.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            console.log(url)
            setFileUrl(url)
        }
        catch(error) {
            console.log('Error uploading file: ', error)
        }
    }

    const createMetadata = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        var signerAddr = await signer.getAddress();
        console.log("Signer: ", signerAddr);
        
        const { name, description, price, addressOwner } = formInput
        if(!name || !description || !price || !fileUrl || !addressOwner) return

        //make metadata
        const metadata = new Object();
        metadata.name = name;
        metadata.image = fileUrl;
        metadata.description = description;
        metadata.price = price;
        metadata.addressOwner = addressOwner;
        metadata.addressToken = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

        try {
            //make pinata call
            const pinataResponse = await pinJSONToIPFS(metadata)
            if(!pinataResponse.success) {
                return {
                    success: false,
                    status: "😢 Something went wrong while uploading your tokenURI.",
                }
            }
            const tokenURI = pinataResponse.pinataUrl
            console.log("TokenURI: ", tokenURI)
            createToken(tokenURI)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const createToken = async (uri) => {
        const { addressOwner } = formInput
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //create token
        let contract = new ethers.Contract(tokenaddress, Token.abi, signer)
        let transaction = await contract.mintNFT(addressOwner, uri)
        await transaction.wait()
        navigate('/displayNFT')
    }

    return (
        <div className="App">
            <input
                placeholder="Address you want to mint"
                onChange={e => updateFormInput({ ...formInput, addressOwner: e.target.value })}
            />
            <br/>
            <input
                placeholder="Asset Name"
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}

            />
            <br/>
            <textarea
                placeholder="Asset Description"
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}

            />
            <br/>
            <input
                placeholder="Asset Price in Eth"
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}

            />
            <br/>
            <input
                type="file"
                name="Asset"
                onChange={onChange}
            />
            <br/>
            {
                fileUrl && (<img width="350" src={fileUrl}/>) 
            }
            <br/>
            <button className="button" onClick={createMetadata}>
                Create Digital Asset
            </button>
        </div>
    )
}

export default Mint