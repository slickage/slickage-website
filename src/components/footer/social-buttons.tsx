'use client';

import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { IconButton } from '@/components/ui/icon-button';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';

export function SocialButtons() {
  const { trackNavigation } = useEventTracking();

  const handleSocialClick = (platform: string, url: string) => {
    trackNavigation(`${platform} Social`, url, 'footer_social');
  };

  return (
    <div className="flex space-x-6">
      <IconButton
        icon={<FaLinkedin />}
        href="https://www.linkedin.com/company/slickage-studios/"
        target="_blank"
        rel="noopener noreferrer"
        variant="blue"
        size="lg"
        aria-label="LinkedIn"
        onClick={() =>
          handleSocialClick('LinkedIn', 'https://www.linkedin.com/company/slickage-studios/')
        }
      />
      <IconButton
        icon={<FaGithub />}
        href="https://github.com/slickage"
        target="_blank"
        rel="noopener noreferrer"
        variant="blue"
        size="lg"
        aria-label="GitHub"
        onClick={() => handleSocialClick('GitHub', 'https://github.com/slickage')}
      />
    </div>
  );
}
