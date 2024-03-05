"use client";
import HomeContainer from "@/app/home";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

const Home = ({ session }: Props) => {
  return (
    <>
      <SessionProvider session={session}>
        <HomeContainer />
      </SessionProvider>
    </>
  );
};

export default Home;
