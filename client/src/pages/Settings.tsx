import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ui/theme-provider';
import { Settings as SettingsIcon, Globe, Bell, Palette, Monitor, Sun, Moon, AlertCircle, CheckCircle, X } from 'lucide-react';

interface SettingsData {
  language: string;
  theme: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  bookingReminders: boolean;
  promotionalEmails: boolean;
  accountUpdates: boolean;
  profileVisibility: string;
  dataSharing: boolean;
}

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'general' | 'notifications'>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [settings, setSettings] = useState<SettingsData>({
    language: i18n.language,
    theme: theme || 'system',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingReminders: true,
    promotionalEmails: false,
    accountUpdates: true,
    profileVisibility: 'private',
    dataSharing: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...data.settings,
          language: i18n.language,
          theme: theme || 'system'
        });
      }
    } catch (err) {
      setError(t('common.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSuccess(t('settings.settingsSaved'));
        setTimeout(() => setSuccess(null), 3000);
        
        // Apply language change
        if (settings.language !== i18n.language) {
          i18n.changeLanguage(settings.language);
        }
        
        // Apply theme change
        if (settings.theme !== theme) {
          setTheme(settings.theme as 'light' | 'dark' | 'system');
        }
      } else {
        setError(t('common.error'));
      }
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSettings({ ...settings, language: newLanguage });
    i18n.changeLanguage(newLanguage);
  };

  const handleThemeChange = (newTheme: string) => {
    setSettings({ ...settings, theme: newTheme });
    setTheme(newTheme as 'light' | 'dark' | 'system');
  };

  if (loading && !settings.language) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-destructive/15 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-destructive hover:text-destructive/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          {success}
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-700 hover:text-green-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'general', label: t('settings.general'), icon: SettingsIcon },
            { key: 'notifications', label: t('settings.notifications'), icon: Bell }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'general' && (
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">{t('settings.general')}</h2>
            
            <div className="space-y-6">
              {/* Language Settings */}
              <div>
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 text-foreground mr-2" />
                  <h3 className="text-lg font-medium text-foreground">{t('settings.language')}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{t('profile.preferredLanguage')}</p>
                
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-background"
                >
                  <option value="tr">{t('profile.turkish')}</option>
                  <option value="en">{t('profile.english')}</option>
                </select>
              </div>

              {/* Theme Settings */}
              <div>
                <div className="flex items-center mb-2">
                  <Palette className="w-5 h-5 text-foreground mr-2" />
                  <h3 className="text-lg font-medium text-foreground">{t('settings.theme')}</h3>
                </div>
                <p className="text-muted-foreground mb-4">Choose your preferred theme</p>
                
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  {[
                    { key: 'light', label: t('settings.light'), icon: Sun },
                    { key: 'dark', label: t('settings.dark'), icon: Moon },
                    { key: 'system', label: t('settings.system'), icon: Monitor }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      className={`${
                        settings.theme === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-input bg-card text-foreground hover:bg-accent'
                      } border-2 rounded-lg p-4 flex flex-col items-center space-y-2 transition-colors`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">{t('settings.notifications')}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">{t('settings.emailNotifications')}</h3>
                <div className="space-y-4">
                  {[
                    { key: 'bookingReminders', label: t('settings.bookingReminders') },
                    { key: 'accountUpdates', label: t('settings.accountUpdates') },
                    { key: 'promotionalEmails', label: t('settings.promotionalEmails') }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-foreground">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[key as keyof SettingsData] as boolean}
                          onChange={(e) => setSettings({
                            ...settings,
                            [key]: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">{t('settings.pushNotifications')}</h3>
                <div className="space-y-4">
                  {[
                    { key: 'pushNotifications', label: t('settings.pushNotifications') },
                    { key: 'smsNotifications', label: t('settings.smsNotifications') }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-foreground">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[key as keyof SettingsData] as boolean}
                          onChange={(e) => setSettings({
                            ...settings,
                            [key]: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>{loading ? t('common.loading') : t('common.save')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
