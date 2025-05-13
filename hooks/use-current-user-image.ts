// import { createClient } from '@/components/clients/nextjs/lib/supabase/client'
import { useUserState } from '@/lib/store/user'

export const useCurrentUserImage = () => {
   // get user profile data
   const user = useUserState(state => state.user);
  // const [image, setImage] = useState<string | null>(null)

  // useEffect(() => {
  //   const fetchUserImage = async () => {
  //     const { data, error } = await createClient().auth.getSession()
  //     if (error) {
  //       console.error(error)
  //     }

  //     setImage(data.session?.user.user_metadata.avatar_url ?? null)
  //   }
  //   fetchUserImage()
  // }, [])

  return user?.avatar_url || "?"
}
