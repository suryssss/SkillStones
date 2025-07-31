'use client';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Navbar from '../../../../components/navbar.jsx';
import Chat from '../components/Chat';

export default function StoneChatPage() {
  const params = useParams();
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const stoneId = params.stoneid;

  return (
    <>
      <Navbar user={user} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 pt-24">
        <div className="w-full max-w-2xl">
          <Chat stoneId={stoneId} user={user} />
        </div>
      </div>
    </>
  );
}
