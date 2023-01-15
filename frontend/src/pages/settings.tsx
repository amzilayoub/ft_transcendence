import MainLayout from "@components/layout";

import Image from "next/image";

import Avatar from "/public/images/default-avatar.jpg";

export default function SettingsPage() {
  return (
    <MainLayout title="Settings">
      <h1 className="text-3xl font-semibold text-center py-10">Settings</h1>
      <div className=" pt-2 font-mono my-16 w-full">
        <div className="container mx-auto bg-gray-200 rounded-lg shadow-2xl">
          <div className=" w-full max-w-2xl p-6 mx-auto">
            <h2 className="text-2xl text-gray-900">Personal info:</h2>
            <form className="mt-6 border-t border-gray-400 pt-4">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-full px-3 mb-6 gap-3 flex flex-col">
                  <div className="flex flex-row justify-between items-center w-full gap-5">
                    <div className="flex flex-col justify-center items-center gap-5">
                      <div className="flex flex-row justify-around items-center gap-5">
                        <div>
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            First Name *
                          </label>
                          <input
                            className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                            type="email"
                            required
                          />
                        </div>
                        <div>
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Last Name *
                          </label>
                          <input
                            className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                            type="email"
                            required
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          Username *
                        </label>
                        <input
                          className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                          type="email"
                          required
                        />
                      </div>
                    </div>

                    <div
                      className="group  w-1/4 bg-black transition rounded-full flex justify-center items-center cursor-pointer"
                      onClick={() => {
                        console.log("clicked");
                      }}
                    >
                      <Image
                        src={Avatar}
                        width={500}
                        height={500}
                        alt={"ss"}
                        className="rounded-full shadow-inner hover:opacity-50 duration-300"
                      />
                      <h1 className="text-white absolute hidden group-hover:block duration-300">
                        upload a photo
                      </h1>
                    </div>
                  </div>
                  <div className="w-full md:w-full">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Bio
                    </label>
                    <textarea className=" placeholder:bg-gray-400 bg-gray-100 rounded-md leading-normal resize-none w-full h-20 py-2 px-3 shadow-inner border border-gray-400 font-medium focus:outline-none focus:bg-white"></textarea>
                  </div>
                </div>

                <div className="flex flex-col w-full md:w-full px-3 mb-6 gap-5">
                  <h2 className="text-2xl text-gray-900">Security Settings:</h2>
                  <div className="flex flex-row justify-between items-center w-full border-t border-gray-400 pt-4">
                    <div className="flex flex-col w-full gap-5">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Old Password
                        <input
                          className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                          type="text"
                          required
                        />
                      </label>
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        New Password
                        <input
                          className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                          type="text"
                          required
                        />
                        <button className="appearance-none bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md ">
                          change your password
                        </button>
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer w-fit">
                        <input
                          type="checkbox"
                          value=""
                          className="peer sr-only"
                        />
                        <div className="peer w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-700">
                          Activate 2FA
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-around items-center">
                <button className="appearance-none bg-red-500 hover:bg-red-700 duration-300 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md ">
                  Delete Account
                </button>
                <button className="appearance-none bg-gray-200 hover:bg-gray-400 duration-300 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md ">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
