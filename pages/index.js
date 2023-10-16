import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { createClient, cacheExchange, fetchExchange } from '@urql/core'
import {ethers} from 'ethers';
import { useState } from 'react';
import {abi} from './abi';

export default function Home() {

  const [address,setAddress]=useState();
  const [contract,setContract]=useState();
  const [message,setMessage]=useState();

const APIURL = 'https://api.studio.thegraph.com/query/55595/eas/v0.0.1'

const EAS_Contract_Address="0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

const tokensQuery = `
  query {
    attesteds(where:{
      recipient:"${address}"
      attester:"0xbc3b2e60738fdc3461c841ede55e81401a54119f"
    }) {
      id
      recipient
      attester
      uid
      transactionHash
    }
  }
`

const client = createClient({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
})

async function getData(){
  if(address!=""){
    const data = await client.query(tokensQuery).toPromise()
    // console.log(data.data.attesteds[0].uid);
    const attestation_data=await contract.getAttestation(data.data.attesteds[0].uid);
    // console.log(attestation_data.data);
    const permission=ethers.utils.defaultAbiCoder.decode(['bool'],attestation_data.data);
    if(permission){
      console.log('Welcome');
      setMessage("Welcome!!!!");
    }else{
      console.log("You are not permitted")
      setMessage("You are not permitted")
    }
  }else{
    alert("Please connect wallet")
  }
}

async function Connect(){
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()
  console.log(await signer.getAddress());
  setAddress(await signer.getAddress());
  const contract=new ethers.Contract(EAS_Contract_Address,abi,provider);
  setContract(contract);
}

async function Login(){
  getData();
}


  return (
    <div className={styles.container}>
      <div>
        <h1>EAS Enabled Login</h1>
      </div>
      <div>
      <button onClick={Connect}>Connect Wallet</button>
      </div>
      <br>
      </br>
     <div>
     <button onClick={Login}>Login</button>
     </div>
     <br>
     </br>
      <div>
        <h1>{message}</h1>
      </div>
    </div>
  );
}
