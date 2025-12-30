import { useState } from "react";
import { Bell, Mail, MessageSquare } from "lucide-react";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    messages: true,
    emailMarketing: false,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8">Notifications</h2>
        <p className="text-n-4 mt-1">
          Choose what you want to be notified about.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-n-3/20 rounded-xl bg-white hover:bg-n-2/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary-3/10 text-primary-3 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <h4 className="font-bold text-n-8">Order Updates</h4>
              <p className="text-sm text-n-5">
                Get notified when order status changes.
              </p>
            </div>
          </div>
          <Toggle
            checked={settings.orderUpdates}
            onChange={() => toggle("orderUpdates")}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-n-3/20 rounded-xl bg-white hover:bg-n-2/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-bold text-n-8">New Messages</h4>
              <p className="text-sm text-n-5">
                Receive notifications for new direct messages.
              </p>
            </div>
          </div>
          <Toggle
            checked={settings.messages}
            onChange={() => toggle("messages")}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-n-3/20 rounded-xl bg-white hover:bg-n-2/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-bold text-n-8">Email Marketing</h4>
              <p className="text-sm text-n-5">
                Receive news, updates, and special offers.
              </p>
            </div>
          </div>
          <Toggle
            checked={settings.emailMarketing}
            onChange={() => toggle("emailMarketing")}
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-3 focus:ring-offset-2 ${
        checked ? "bg-primary-3" : "bg-n-3"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
