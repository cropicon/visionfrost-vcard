import React from 'react';
import { useVCardStore } from '../store/useVCardStore';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  Instagram, 
  MessageCircle,
  MapPinned,
  Download,
  FileImage,
  File,
  Facebook,
  Twitter,
  Github,
  Youtube,
  Share2,
  Copy,
  Check,
  Building2,
  Briefcase
} from 'lucide-react';
import { Button } from './ui/Button';
import { ImageSlider } from './ImageSlider';

const PLATFORM_ICONS = {
  Facebook,
  Twitter,
  GitHub: Github,
  YouTube: Youtube,
} as const;

interface VCardPreviewProps {
  onEdit?: () => void;
  isPreviewMode?: boolean;
}

export const VCardPreview: React.FC<VCardPreviewProps> = ({ 
  onEdit, 
  isPreviewMode = false 
}) => {
  const { data, generateShareableLink, isPreviewMode: storePreviewMode } = useVCardStore();
  const effectivePreviewMode = isPreviewMode || storePreviewMode;
  const [shareUrl, setShareUrl] = React.useState('');
  const [showShareFallback, setShowShareFallback] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [photoError, setPhotoError] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!effectivePreviewMode) {
      setShareUrl(generateShareableLink());
    }
  }, [generateShareableLink, effectivePreviewMode]);

  const generateVCardContent = () => {
    const vCardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.firstName} ${data.lastName}`,
      `N:${data.lastName};${data.firstName};;;`,
      data.organization ? `ORG:${data.organization}` : '',
      data.title ? `TITLE:${data.title}` : '',
      data.phone ? `TEL;TYPE=WORK,VOICE:${data.phone}` : '',
      data.email ? `EMAIL;TYPE=WORK,INTERNET:${data.email}` : '',
      data.website ? `URL:${data.website}` : '',
      data.address.street ? 
        `ADR;TYPE=WORK:;;${data.address.street};${data.address.city};${data.address.state};${data.address.zip};${data.address.country}` : '',
      ...data.customFields.map(field => `NOTE;LABEL="${field.label}":${field.value}`),
      data.social.linkedin ? `URL;TYPE=LinkedIn:${data.social.linkedin}` : '',
      data.social.instagram ? `URL;TYPE=Instagram:${data.social.instagram}` : '',
      data.social.whatsapp ? `URL;TYPE=WhatsApp:https://wa.me/${data.social.whatsapp}` : '',
      ...data.additionalSocial.map(social => `URL;TYPE=${social.platform}:${social.url}`),
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    return vCardLines;
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${data.firstName} ${data.lastName}'s Contact Card`,
          text: 'Check out my contact information',
          url: shareUrl
        });
      } else {
        await handleCopyLink();
        setShowShareFallback(true);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setShowShareFallback(true);
      }
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Copy failed:', fallbackError);
        alert('Please manually copy this link: ' + shareUrl);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleQRCodeClick = () => {
    const vCardContent = generateVCardContent();
    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.firstName}_${data.lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-xl dark:bg-gray-800 dark:text-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {effectivePreviewMode ? 'Contact Card Preview' : 'VisionFrost vCard'}
        </h1>
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
          {data.photo && !photoError ? (
            <img
              src={data.photo}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setPhotoError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400 dark:text-gray-500">
              {data.firstName.charAt(0)}{data.lastName.charAt(0)}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {data.firstName} {data.lastName}
        </h2>
        {data.title && (
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            <span className="inline-flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              {data.title}
            </span>
          </p>
        )}
        {data.organization && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            <span className="inline-flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              {data.organization}
            </span>
          </p>
        )}
      </div>

      <div className="space-y-4">
        {data.phone && (
          <a href={`tel:${data.phone}`} className="flex items-center space-x-3 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Phone className="w-5 h-5 text-gray-400" />
            <span>{data.phone}</span>
          </a>
        )}
        
        {data.email && (
          <a href={`mailto:${data.email}`} className="flex items-center space-x-3 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{data.email}</span>
          </a>
        )}
        
        {data.website && (
          <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Globe className="w-5 h-5 text-gray-400" />
            <span>{data.website}</span>
          </a>
        )}

        {data.address.street && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zip}, ${data.address.country}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MapPinned className="w-5 h-5 text-gray-400" />
            <span className="flex-1">
              {data.address.street}<br />
              {data.address.city}, {data.address.state} {data.address.zip}<br />
              {data.address.country}
            </span>
          </a>
        )}

        {data.customFields.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
            {data.customFields.map((field) => (
              <div key={field.id} className="flex items-center space-x-3 p-2">
                <span className="font-medium text-gray-600 dark:text-gray-300">{field.label}:</span>
                <span className="text-gray-800 dark:text-gray-200">{field.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {(data.social.linkedin || data.social.instagram || data.social.whatsapp || data.additionalSocial.length > 0) && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3">Social Media</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {data.social.linkedin && (
              <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                <Linkedin className="w-6 h-6 text-gray-600 hover:text-blue-600 dark:text-gray-400" />
              </a>
            )}
            {data.social.instagram && (
              <a href={data.social.instagram} target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6 text-gray-600 hover:text-pink-600 dark:text-gray-400" />
              </a>
            )}
            {data.social.whatsapp && (
              <a href={`https://wa.me/${data.social.whatsapp}`} target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-gray-600 hover:text-green-600 dark:text-gray-400" />
              </a>
            )}
            {data.additionalSocial.map((social) => {
              const IconComponent = PLATFORM_ICONS[social.platform as keyof typeof PLATFORM_ICONS];
              return IconComponent ? (
                <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-gray-600 hover:text-blue-600 dark:text-gray-400" />
                </a>
              ) : null;
            })}
          </div>
        </div>
      )}

      <ImageSlider isPreviewMode={effectivePreviewMode} />

      <div className="mt-6 flex justify-center qr-code" ref={qrRef}>
        <div 
          onClick={handleQRCodeClick}
          className="cursor-pointer hover:opacity-90 transition-opacity"
          title="Click to download vCard"
        >
          <QRCodeSVG
            value={shareUrl || window.location.href}
            size={200}
            level="H"
            includeMargin={true}
            className="dark:bg-white p-2 rounded"
          />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Scan to save contact
          </p>
        </div>
      </div>

      {!effectivePreviewMode && (
        <div className="mt-6 space-y-4">
          {(showShareFallback || !navigator.share) && shareUrl && (
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">Share this link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button 
                  onClick={handleCopyLink} 
                  variant="secondary" 
                  size="sm"
                  className="min-w-[80px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button 
              onClick={handleShare} 
              className="flex-1"
              title={!navigator.share ? "Copy link to clipboard" : "Share contact card"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  {!navigator.share ? "Copy Link" : "Share"}
                </>
              )}
            </Button>
            {onEdit && (
              <Button onClick={onEdit} variant="secondary" className="flex-1">
                Edit
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};