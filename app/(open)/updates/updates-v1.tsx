"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { updates } from '@/constants/changeLogs';
import { ArrowLeft } from 'lucide-react';

const UpdatesPage = () => {
    const router = useRouter()
  return (
    <div className="flex min-h-screen justify-center bg-white dark:bg-black  relative pt-14">
       <div className="fixed top-0 flex h-12 w-full items-center justify-center bg-white dark:bg-black md:hidden">
        <div
          className="absolute left-4 hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </div>

        <p className="text-center">Updates</p>
      </div>
      <div className="mx-auto w-full sm:w-2/3">
        {updates.map(log => (
          <div key={log.version} className="px-3 pt-5 sm:px-1 pb-3">
            <div className="mb-3 flex items-center gap-4">
              <div className="rounded-md bg-primary-500 px-3 py-1">
                {log.version}
              </div>
              <p className="text-sm text-gray-400">{log.date} </p>
            </div>
            <p className="mb-2 text-xl font-bold">{log.title}</p>
            <div className="pl-10">
              <ul className="list-disc">
                {log.changes.map((change, index) => {

                  return change.startsWith("**") ?  <li key={index} className="text-primary-500 list-none pt-2 pb-1 font-bold">{change}</li> : <li key={index}>{change}</li>
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdatesPage;
