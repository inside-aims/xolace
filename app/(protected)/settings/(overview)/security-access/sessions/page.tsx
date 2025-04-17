import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import { ChevronRight, Laptop } from "lucide-react";
import {Button}from '@/components/ui/button';

interface LoggedInSessionsInterface {
  deviceIP: string,
  deviceName: string,
  sessionStatus: boolean,
  lastSession: string
}
const loggedInSessions: LoggedInSessionsInterface [] = [
  {
    deviceIP: "192.168.0.10",
    deviceName: "Windows Laptop",
    sessionStatus: true,
    lastSession: "2025-04-15T14:30:00Z"
  },
  {
    deviceIP: "10.0.0.5",
    deviceName: "iPhone 13 Pro",
    sessionStatus: false,
    lastSession: "2025-04-12T08:45:00Z"
  },
  {
    deviceIP: "172.16.0.22",
    deviceName: "MacBook Air",
    sessionStatus: false,
    lastSession: "2025-04-09T17:20:00Z"
  }
];


export default function SessionsPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <SessionsContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          < SessionsContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}
function  SessionsContent() {
  return(
    <SettingsNavigationWrapper title="Sessions">
      <div className={"w-full flex flex-col items-start gap-4"}>
        <p className={"w-full text-neutral-400 px-4"}>
          Sessions are the devices you are using or that have used your Xolace account. These are the sessions where your account is currently logged in. You can log out of each session.
        </p>
        <div className={"w-full flex flex-col items-start gap-2"}>
          <h4 className={"px-4 w-full font-semibold text-lg"}>
            Current active session
          </h4>
          <p className={"px-4 w-full text-neutral-400"}>
            You’re logged into this Xolace account on this device and are currently using it.
          </p>
          {/*active loggedIn sessions*/}
          {
            loggedInSessions.filter((device ) => device.sessionStatus)?.map((item)=> (
              <DeviceSessionsCard
                key={`${item.deviceIP} - ${item.deviceName}`}
                deviceIP={item.deviceIP}
                deviceName={item.deviceName}
                lastSession={item.lastSession}
                sessionStatus={item.sessionStatus}
              />
            ))
          }
        </div>
        <div className={"border-t w-full"}>
          <div className={"w-full flex flex-col items-start gap-2 pt-2"}>
            <h4 className={"px-4 w-full font-semibold text-lg"}>
              Log out of other sessions
            </h4>
            <p className={"px-4 w-full text-neutral-400"}>
              You’re logged into these accounts on these devices and aren’t currently using them.
            </p>
            <p className={"px-4 w-full text-neutral-400"}>
              Logging out will end 2 of your other active Xolace sessions. It won’t affect your current active session.
            </p>
            <Button className={"py-8 w-full flex items-center rounded-none text-red-600 hover:bg-red-50  bg-neutral-100 dark:bg-neutral-900"} variant={"ghost"}>
              <span className={"text-red-800 text-start mr-auto text-lg"}>
                Log out of all other sessions
              </span>
            </Button>
            {/*previous loggedIn sessions*/}
            {
              loggedInSessions.filter((device ) => !device.sessionStatus)?.map((item)=> (
                <DeviceSessionsCard
                  key={`${item.deviceIP} - ${item.deviceName}`}
                  deviceIP={item.deviceIP}
                  deviceName={item.deviceName}
                  lastSession={item.lastSession}
                  sessionStatus={item.sessionStatus}
                />
              ))
            }
          </div>
        </div>
      </div>
    </SettingsNavigationWrapper>
  )
}


function DeviceSessionsCard(props: LoggedInSessionsInterface) {
  return (
    <div className={"px-4 py-2 flex w-full items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"}>
      <div className={'flex items-center flex-row gap-8'}>
        <p className={"flex w-12 h-12 rounded-full border p-1 items-center justify-center"}>
          <Laptop/>
        </p>
        <div className={"items-center"}>
          <h5>{props.deviceName}</h5>
          <p className={" flex text-neutral-500"}>Accra, Ghana -
            {
              props.sessionStatus ?
                (<span className={"flex ml-1 text-xs items-center justify-center px-2 border rounded-md text-white bg-green-600"}>
                   Active
                </span>
                ): (
                  <span className={"ml-1"}>
                     5days ago
                  </span>
                )
            }
          </p>
        </div>
      </div>
      <ChevronRight/>
    </div>
  )
}