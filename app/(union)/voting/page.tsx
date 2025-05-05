import { redirect } from 'next/navigation';

export default function PageRedirect() {
    redirect('/voting/25');
    return (
        <div>
            Redirecting...
        </div>
    )
}