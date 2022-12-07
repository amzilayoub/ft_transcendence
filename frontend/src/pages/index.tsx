import MainLayout from "@components/layout";
import Button from "@ui/Button";
import DropDown from "@ui/DropDown";
import TextInput from "@ui/TextInput";

export default function Home() {
  return (
    <MainLayout title="Home">
      <main className="flex-col p-10 gap-3 flex justify-end">
        <DropDown menuButton={<Button>Click me!</Button>}>
          <p className="px-4 py-3 rounded-md  hover:bg-gray-100 duration-200 hover:text-gray-900 cursor-pointer">
            Profile
          </p>
          <p className="px-4 py-3 rounded-md  hover:bg-gray-100 duration-200 hover:text-gray-900 cursor-pointer">
            Settings
          </p>
          <p className="px-4 py-3 rounded-md text-red-500 hover:bg-red-500 duration-200 hover:text-white cursor-pointer">
            Logout
          </p>
        </DropDown>
        <div className="w-96">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            type="email"
            onChange={() => {}}
          />
        </div>
        <Button>Primary </Button>
        <Button variant="danger">Danger</Button>

        <Button variant="primary" size="large">
          Primary Large
        </Button>

        <Button variant="danger" size="large">
          Danger Large
        </Button>
        <Button variant="primary" size="small">
          Primary Small
        </Button>
        <Button variant="secondary" size="small">
          Secondary Small
        </Button>
        <Button variant="primary" size="small" disabled>
          Primary Small Disabled
        </Button>
        <Button variant="primary" size="normal" isLoading>
          Primary Normal Loading
        </Button>
      </main>
    </MainLayout>
  );
}
