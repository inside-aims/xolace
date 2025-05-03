import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import {Checkbox} from "@/components/ui/checkbox";

const twoFactorAuthentication: {key: string, description: string, status: boolean, label: string}[] = [
{
  key: "textMessage",
  description: "Use your mobile phone to receive a text message with an authentication code to enter when you log in to Xolace.",
  label: "Text message",
  status: false,
},
  {
    key: "authenticatorApp",
    description: "Use a mobile authentication app to get a verification code to enter every time you log in to Xolace.",
    label: "Authenticator App",
    status: false,
  },
  {
    key: "securityKey",
    description: "Use a security key that inserts into your computer or syncs to your mobile device when you log in to Xolace. You’ll need to use a supported mobile device or web browser.",
    label: "Security key",
    status: false,
  },

]
export default  function TwoFactorAuthenticationPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <TwoFactorAuthenticationContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <TwoFactorAuthenticationContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function TwoFactorAuthenticationContent() {
  return(
    <SettingsNavigationWrapper title="Two factor authentication">
      <div className={"px-4  w-full flex flex-col items-start gap-4"}>
        <h4 className={"w-full flex items-center font-semibold text-lg"}>
          Two factor authentication
        </h4>
        <div className={"w-full flex flex-col items-start gap-4"}>
          {
            twoFactorAuthentication.map((item) => (
              <div className={"w-full flex flex-col items-start"} key={item.key}>
                <h4 className={"w-full flex items-center justify-between"}>
                  {item.label}
                  <span className={"justify-end ml-auto"}>
                    <Checkbox defaultChecked={item.status}/>
                  </span>
                </h4>
                <p className={"text-sm text-neutral-500"}>
                  {item.description}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}