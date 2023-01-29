import { useState, useEffect, useRef } from "react";

import { NextPageContext } from "next";
import Image from "next/image";
import { BiHide, BiShowAlt } from "react-icons/bi";

import MainLayout from "@components/layout";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import { LANDING_IMAGE } from "@utils/constants";
import basicFetch from "@utils/basicFetch";

import { SlScreenSmartphone } from "react-icons/sl";

const TwoFactorAuthForm = () => {
  const [code, setCode] = useState("");
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState([]);
  const firstInputEl = useRef(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await basicFetch.post(
        "/2fa/verify",
        {},
        {
          code,
        }
      );
      if (res.ok) {
        window.location.href = "/home";
      } else {
        setIsCodeInvalid(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleOtpInput = (e) => {
  //   console.log("#####", e.target.value);
  //   console.log("@@", e.target.nextSibling);

  //   if (e.key === "Backspace") {
  //     e.target.value = "";
  //     e.target.previousSibling && e.target.previousSibling.focus();
  //     return
  //   }
  //   else if ("0123456789".includes(e.key)) {
  //     console.log("!!!!!!", e.target.nextSibling);
  //     e.target.nextSibling && e.target.nextSibling.focus();
  //   }
  // };

  // const handlePaste = (e) => {
  //   const pasteData = e.clipboardData.getData('text');
  //   let nextEl = firstInputEl.current.nextSibling;
  //   for (let i = 1; i < pasteData.length; i++) {
  //     if (nextEl) {
  //       setData(prevData => {
  //         prevData[i] = pasteData[i]
  //         return [...prevData]
  //       });
  //       nextEl = nextEl.nextSibling;
  //     }
  //   }
  // };

  useEffect(() => {
    if (code.length === 6) {
      handleSubmit();
    }
  }, [code]);

  return (
    <section className="flex flex-col justify-center w-full xl:text-black text-gray-200">
      <SlScreenSmartphone className="mx-auto text-5xl " />
      <h1 className="text-2xl font-bold text-center py-6">
        Enter your 2FA code
      </h1>
      <div className="flex flex-col w-full gap-y-8">
        <TextInput
          name="code"
          placeholder="XXXXXX"
          onChange={(e) => setCode(e.target.value)}
          inputClassName="h-10"
          error={isCodeInvalid ? "Invalid code" : null}
        />

        {/* <div className="w-full flex justify-around gap-x-2" onKeyDown={handleOtpInput}>
          {new Array(6).fill(0).map((_, i) => (
            <input
            id={i}
              key={i}
              ref={i === 0 ? firstInputEl : null}
              value={data[i]}
              type="number"
              min="0"
              max="9"
              className="border rounded-lg w-12 h-14 text-center"
              onPaste={handlePaste}
              onChange={(e) => {
                if ("0123456789".includes(e.target.value) === false) {
                  return;
                }
                setData(prevData => {
                  prevData[i] = e.target.value
                  return [...prevData]
                });
                setCode(prevCode => {
                  prevCode = prevCode.split('');
                  prevCode[i] = e.target.value;
                  return prevCode.join('');
                });
              }}
            />
          ))}
        </div> */}
        <div className="flex justify-center w-full">
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="max-w-none w-full px-10 py-2 transition duration-300 ease-in-out bg-orange-500 rounded-xl hover:scale-105 hover:bg-orange-600"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
      <style jsx>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type="number"] {
          -moz-appearance: textfield;
        }
        caret-color: transparent;
      `}</style>
    </section>
  );
};

const SiginFields = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section className="relative flex flex-col justify-center w-full cursor-wait group">
      <div className="flex flex-col w-full cursor-wait gap-y-4 group-hover:blur-sm">
        <TextInput
          label="Username or Email"
          placeholder="Username or Email"
          name="username"
          onChange={() => {}}
          inputClassName="h-10 cursor-wait"
        />
        <div className="relative">
          <TextInput
            label="Password"
            placeholder="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={() => {}}
            inputClassName="h-10 cursor-wait"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 bottom-1.5 rounded-lg p-1.5 text-gray-500 duration-300 hover:bg-gray-200 hover:text-gray-700"
          >
            {showPassword ? <BiHide /> : <BiShowAlt />}
          </button>
        </div>
        <Button onClick={() => {}} className="min-w-full cursor-wait">
          Sign In
        </Button>
      </div>
      <p className="absolute hidden w-full font-mono text-3xl font-semibold text-center text-gray-800 cursor-wait group-hover:block">
        Soon...?
      </p>
    </section>
  );
};

export default function LandingPage() {
  const [show2fa, setShow2fa] = useState(false);
  const [code, setCode] = useState("");

  const handle42Login = async () => {
    window.location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/login42";
  };

  useEffect(() => {
    if (location.search.includes("2fa")) {
      setShow2fa(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  return (
    <MainLayout pageIsProtected={false} noLayout>
      <div className="grid min-h-screen grid-cols-5">
        <div className="grid items-center justify-center col-span-5 xl:col-span-2 z-30 ">
          <div className="relative rounded-xl">
            <section
              className="flex flex-col  rounded-xl items-center max-w-md py-24 shadow-2xl gap-y-10 
            px-16 bg-clip-padding xl:bg-white bg-gray-900 backdrop-filter backdrop-blur-xl bg-opacity-50 border border-gray-500/20"
            >
              {show2fa ? (
                <TwoFactorAuthForm />
              ) : (
                <>
                  <header className="flex flex-col items-center gap-y-2 xl:text-black text-gray-200">
                    <h1 className="text-4xl font-bold">Sign in to Pong</h1>
                    <p className="text-gray-500 text-lg">
                      Login to play Pong with your friends
                    </p>
                  </header>
                  <SiginFields />
                  <p className="text-gray-500">
                    <span className="inline-block w-32 h-px mb-1 bg-gray-200" />
                    <span className="mx-2">OR</span>
                    <span className="inline-block w-32 h-px mb-1 bg-gray-200" />
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handle42Login();
                    }}
                    type="button"
                    className="flex items-center justify-center w-full px-10 py-2 transition duration-300 ease-in-out bg-orange-500 gap-x-4 rounded-xl hover:scale-105 hover:bg-orange-600"
                  >
                    <Image
                      src={"/42-logo.svg"}
                      width={36}
                      height={36}
                      alt="42 logo"
                    />
                    <p className="pb-0.5 text-lg font-semibold text-black">
                      Sign in with 42
                    </p>
                  </button>
                </>
              )}
            </section>
          </div>
        </div>
        <figure className=" w-full h-full col-span-5 z-0 absolute xl:static xl:col-span-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LANDING_IMAGE}
            alt="Pong image"
            className="object-cover w-full h-full max-h-screen"
          />
        </figure>
      </div>
    </MainLayout>
  );
}

/*
 * Note:
 * For the initial page load, this will run on the server only.
 * And will then run on the client when navigating to a different
 * route via the next/link component or by using next/router
 * */
LandingPage.getInitialProps = async (ctx: NextPageContext) => {
  /*
   * We are assuming that the user is already logged in
   * if it has an Authentication cookie, so we redirect him to the home page.
   * And in case the cookie is not valid, the server will delete it
   * and redirect the user to the login page.
   * */

  //   if (ctx?.req?.headers?.cookie?.includes("Authentication")) {
  //     ctx.res.writeHead(303, { Location: "/home" });
  //     ctx.res.end();
  //   }

  return {};
};
