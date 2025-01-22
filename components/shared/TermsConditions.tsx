import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircledIcon } from '@radix-ui/react-icons';

export function TermsConditions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sky-600" variant="link" size="link">
          Terms & Conditions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[50%] max-w-[95%] overflow-auto text-black dark:text-white md:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>User Anonymity</DialogTitle>
          <DialogDescription>
            This website allows users to participate anonymously and that their
            identities will not be disclosed without their consent, except as
            required by law. Emphasize that users are responsible for
            maintaining their own anonymity and should exercise caution while
            interacting with others on the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <h3 className="py-2 text-lg font-semibold">Prohibited Activities</h3>
          <p>
            {' '}
            Explicitly state the activities that are strictly prohibited on the
            website, such as:
          </p>
          <ol className="my-2">
            <li>
              {' '}
              <span>
                <CheckCircledIcon className="mr-2 inline text-red-500" />
              </span>{' '}
              Harassment, bullying, or threats towards other users.
            </li>
            <li>
              <CheckCircledIcon className="mr-2 inline text-red-500" /> Illegal
              activities, including but not limited to hacking, fraud, or
              sharing copyrighted material without permission.
            </li>
            <li>
              <CheckCircledIcon className="mr-2 inline text-red-500" /> Hate
              speech, discrimination, or promoting violence.
            </li>
            <li>
              <CheckCircledIcon className="mr-2 inline text-red-500" /> Sharing
              personal information or engaging in doxing (revealing others&apos;
              private information).
            </li>
            <li>
              <CheckCircledIcon className="mr-2 inline text-red-500" />{' '}
              Spreading misinformation or engaging in malicious activities that
              could harm individuals or society.
            </li>
          </ol>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
