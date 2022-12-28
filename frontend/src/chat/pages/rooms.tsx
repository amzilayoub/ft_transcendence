import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'
import Leftbar from '../components/Leftbar';
import { Context } from '../context';

const Rooms = () => {
  const { username,  } = React.useContext(Context);
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="flex">
      <Head>
        <title>Rooms</title>
      </Head>
      <Leftbar />
      <div className="w-[380px] flex justify-center items-center bg-[#303841]">
        <div className=" text-4xl text-black">Room list</div>
      </div>
      <div className="w-full h-screen bg-[#262E35]">
        <div className="flex justify-center items-center h-20">
            <div className="text-4xl text-white">Room Name</div>
        </div>
        <div className="flex justify-center items-center h-full">
            <div className="text-4xl text-white">Room chat</div>
        </div>
      </div>
    </div>
  );
}

export default Rooms