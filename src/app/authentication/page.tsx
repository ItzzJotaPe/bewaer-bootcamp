import { Header } from "@/components/common/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authentication = async () => {
  return (
    <>
      <Header />

      <div className="flex w-full flex-col gap-4 p-4 sm:gap-6 sm:p-5 lg:h-[calc(100vh-80px)] lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:p-6">
        <div className="w-full lg:max-w-md">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="sign-in"
                className="text-xs sm:text-sm lg:text-base"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="sign-up"
                className="text-xs sm:text-sm lg:text-base"
              >
                Criar conta
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in" className="w-full">
              <SignInForm />
            </TabsContent>
            <TabsContent value="sign-up" className="w-full">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Authentication;
