import SettingsWrapper from "@/components/settings/settings-wrapper";
import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {SettingsNavigationWrapper, AccountInformationCard} from "@/components/settings/settings-navigation";
import { ChevronRight } from "lucide-react";

interface AccountInfoDetailsProps {
  key: string,
  label: string,
  icon?: React.ReactNode,
  response?: string,
  href: string
}

//Various settings options for account info details
const  accountInfoDetails: AccountInfoDetailsProps[] = [
  {key: 'username', label: 'Username', icon: <ChevronRight/>, response: 'fedeJnr', href: '/settings/your-account/username'},
  {key: 'phone', label: 'Phone', icon: <ChevronRight/>, href: '/settings/your-account/phone'},
  {key: 'email', label: 'Email', icon: <ChevronRight/>, href: '/settings/your-account/email', response: 'fedejnr08@gmail.com'},
  {key: 'verified', label: 'Verified', href: '', response: 'No'},
  {key: 'protectedPost', label: 'Protected Post', icon: <ChevronRight/>, href: '', response: 'No'},
  {key: 'accountCreation', label: 'Account Creation', response: 'Aug 11, 2020, 10;30pm', href: ''},
  {key: 'country', label: 'Country', response: 'Uruguay', href: '', icon: <ChevronRight/>},
  {key: 'language', label: 'Language', response: 'German', href: '', icon: <ChevronRight/>},
  {key: 'gender', label: 'Gender', response: 'Male', href: '', icon: <ChevronRight/>},
  {key: 'birthDate', label: 'Birth Date', response: 'Age your date birth to your profile', href: '', icon: <ChevronRight/>},
  {key: 'age', label: 'Age', response: '14-35', href: '', icon: <ChevronRight/>},
  {key: 'automation', label: 'Automation', response: 'Manage your automated account', icon: <ChevronRight/>, href: ''}


]
export default function YourAccountPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <YourAccountContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <YourAccountContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function YourAccountContent() {
  return(
    <>
      <SettingsNavigationWrapper title={"Account Information"}>
        {/*Password confirmation before access granted*/}
        {/*<div className={"w-full"}>*/}
        {/*  <div className={"flex flex-col gap-2 items-start border-b"}>*/}
        {/*    <h5 className={"text-lg font-semibold py-2 px-4"}>Confirm your password</h5>*/}
        {/*    <span className={"text-neutral-500 text-sm py-2 px-4"}>*/}
        {/*      Please enter your password before to get this*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*  <div className={"w-full py-2 px-4"}>*/}
        {/*    <Input*/}
        {/*      type={"password"}*/}
        {/*      name={'password'}*/}
        {/*      placeholder={'Enter your password'}*/}
        {/*      className={"py-6"}*/}
        {/*    />*/}
        {/*    <span className={"px-1 cursor-pointer hover:underline"}>*/}
        {/*    <small className={"text-blue-400 hover:text-blue-500"}>*/}
        {/*      Forgot password*/}
        {/*    </small>*/}
        {/*  </span>*/}
        {/*    <div className={"flex mx-auto justify-end pt-4"}>*/}
        {/*      <Button className={"rounded-full"} type="submit">*/}
        {/*        Confirm*/}
        {/*      </Button>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*your account setting options*/}
        <div className={"w-full flex flex-col items-start gap-4"}>
          <div className={"w-full flex flex-col items-start gap-2 border-b pb-2"}>
            {
              accountInfoDetails.slice(0, 4).map(detail => (
                <AccountInformationCard
                  key={detail.key}
                  label={detail.label}
                  icon={detail.icon}
                  href={detail.href}
                  response={detail.response}
                />
              ))
            }
          </div>
          <div className={"w-full flex flex-col items-start gap-2 border-b pb-2"}>
            {
              accountInfoDetails.slice(4, 6).map(detail => (
                <AccountInformationCard
                  key={detail.key}
                  label={detail.label}
                  icon={detail.icon}
                  href={detail.href}
                  response={detail.response}
                />
              ))
            }
          </div>
          <div className={"w-full flex flex-col items-start gap-2 border-b pb-2"}>
            {
              accountInfoDetails.slice(6, 10).map(detail => (
                <AccountInformationCard
                  key={detail.key}
                  label={detail.label}
                  icon={detail.icon}
                  href={detail.href}
                  response={detail.response}
                />
              ))
            }
          </div>
          <div className={"w-full flex flex-col items-start gap-2 border-b pb-2"}>
            {
              accountInfoDetails.slice(10).map(detail => (
                <AccountInformationCard
                  key={detail.key}
                  label={detail.label}
                  icon={detail.icon}
                  href={detail.href}
                  response={detail.response}
                />
              ))
            }
          </div>
        </div>
      </SettingsNavigationWrapper>
    </>
  )
}