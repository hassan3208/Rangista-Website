import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <div className="container py-16 grid gap-8 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-3xl">Contact</h1>
        <ul className="mt-4 space-y-2 text-sm">
          <li>WhatsApp: <a className="underline" href="https://wa.me/923328425042" target="_blank" rel="noreferrer">03328425042</a></li>
          <li>Email: <a className="underline" href="mailto:itsmywork1019@gmail.com">itsmywork1019@gmail.com</a></li>
          <li>Facebook: <a className="underline" href="https://www.facebook.com/profile.php?id=100065230491278" target="_blank" rel="noreferrer">View page</a></li>
          <li>Instagram: <a className="underline" href="https://www.instagram.com/_rangista/" target="_blank" rel="noreferrer">@_rangista</a></li>
        </ul>
      </div>
      <form className="space-y-3">
        <div>
          <label className="text-sm">Name</label>
          <Input required />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" required />
        </div>
        <div>
          <label className="text-sm">Message</label>
          <Textarea rows={5} required />
        </div>
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
