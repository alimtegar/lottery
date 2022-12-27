type Props = {
    children: React.ReactNode
}

const Layout = ({children}: Props) => (
    <div className="bg-base-200 flex justify-center">
        <div className="flex flex-col bg-white w-96 min-h-screen p-4 prose">
            {children}
        </div>
    </div>
);

export default Layout;