const logo = (outline: string, bold: string) => {
    return (
        <div className="flex">
            <Link href='/dashboard' className="flex">
                <AppLogo size={42} className='ml-5 mr-5' />{outline} <span className="font-bold">{bold}</span>
            </Link>
        </div>
    );
};