
import { NativeItems } from "@/components/shared/NativeItems"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black p-4 w-full">
      <h1 className="mb-6 text-lg font-medium text-white text-center">About</h1>
      

      {/* Features Section */}
        <div className="rounded-lg bg-zinc-900 mb-5 w-full">
          <NativeItems
            items={[
              { icon: "Eclipse", label: "About Xolace", href: "/about/general" },
            ]}
          />
        </div>

      {/* Settings Section */}
        <div className="rounded-lg bg-zinc-900">
          <NativeItems
            items={[
              { icon: "Key", label: "Terms", href: "/about/terms" },
              { icon: "GlobeLock", label: "Privacy", href: "/about/privacy" },
              { icon: "Copyright", label: "Credits & Licenses", href: "/about/credits" },
            ]}
          />
        </div>

    </div>
  )
}

