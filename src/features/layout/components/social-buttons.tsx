import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { IconButton } from '@/components/ui/icon-button';

export function SocialButtons() {

  return (
    <div className="flex space-x-6 min-h-[48px] w-[120px]">
      <IconButton
        icon={<FaLinkedin />}
        href="https://www.linkedin.com/company/slickage-studios/"
        target="_blank"
        rel="noopener noreferrer"
        variant="blue"
        size="lg"
        aria-label="LinkedIn"
      />
      <IconButton
        icon={<FaGithub />}
        href="https://github.com/slickage"
        target="_blank"
        rel="noopener noreferrer"
        variant="blue"
        size="lg"
        aria-label="GitHub"
      />
    </div>
  );
}
