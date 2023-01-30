import { useState, useEffect, useRef } from "react";

import { NextPageContext } from "next";
import Image from "next/image";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { SlScreenSmartphone } from "react-icons/sl";

import MainLayout from "@components/layout";
import Button from "@ui/Button";
import TextInput from "@ui/TextInput";
import basicFetch from "@utils/basicFetch";
import { LANDING_IMAGE } from "@utils/constants";

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
    <section className="flex w-full flex-col justify-center text-gray-200 xl:text-black">
      <SlScreenSmartphone className="mx-auto text-5xl " />
      <h1 className="py-6 text-center text-2xl font-bold">
        Enter your 2FA code
      </h1>
      <div className="flex w-full flex-col gap-y-8">
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
        <div className="flex w-full justify-center">
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="w-full max-w-none rounded-xl bg-orange-500 px-10 py-2 transition duration-300 ease-in-out hover:scale-105 hover:bg-orange-600"
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
    <section className="group relative flex w-full cursor-wait flex-col justify-center">
      <div className="flex w-full cursor-wait flex-col gap-y-4 group-hover:blur-sm">
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
      <p className="absolute hidden w-full cursor-wait text-center font-mono text-3xl font-semibold text-gray-800 group-hover:block">
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
        <div className="z-30 col-span-5 grid items-center justify-center xl:col-span-2 ">
          <div className="relative rounded-xl">
            <section
              className="flex max-w-md  flex-col items-center gap-y-10 rounded-xl border border-gray-500/20 
            bg-gray-900 bg-opacity-50 bg-clip-padding py-24 px-16 shadow-2xl backdrop-blur-xl xl:bg-white"
            >
              {show2fa ? (
                <TwoFactorAuthForm />
              ) : (
                <>
                  <header className="flex flex-col items-center gap-y-2 text-gray-200 xl:text-black">
                    <h1 className="text-4xl font-bold">Sign in to Pong</h1>
                    <p className="text-lg text-gray-500">
                      Login to play Pong with your friends
                    </p>
                  </header>
                  <SiginFields />
                  <p className="text-gray-500">
                    <span className="mb-1 inline-block h-px w-32 bg-gray-200" />
                    <span className="mx-2">OR</span>
                    <span className="mb-1 inline-block h-px w-32 bg-gray-200" />
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handle42Login();
                    }}
                    type="button"
                    className="flex w-full items-center justify-center gap-x-4 rounded-xl bg-orange-500 px-10 py-2 transition duration-300 ease-in-out hover:scale-105 hover:bg-orange-600"
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
        <figure className=" absolute z-0 col-span-5 h-full w-full xl:static xl:col-span-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LANDING_IMAGE}
            alt="Pong image"
            className="h-full max-h-screen w-full object-cover"
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

  if (!ctx.res) {
    // throw new Error("Server-side only");
    return {};
  }
  if (ctx?.req?.headers?.cookie?.includes("Authentication")) {
    ctx.res.writeHead(303, { Location: "/home" });
    ctx.res.end();
  }

  return {};
};
