import Alert, {ErrorAlert} from "../shared/xolace-alert"
import { Button } from "../ui/button"

const InviteError = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center dark:bg-bg-dark bg-bg text-foreground min-h-screen gap-3 md:px-0 px-2">
            <ErrorAlert title="Invite Error" description="Invite code is invalid or expired. If this is a mistake, please contact support." supportingText="xolace25@gmail.com"/>
            <Button className="bg-lavender-500 hover:bg-lavender-600 text-white">Back to login</Button>  
        </div>
    )
}

export default InviteError
