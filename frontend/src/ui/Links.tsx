interface ExternalLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  rel?: string;
  target?: string;
}

export const ExternalLink = (props: ExternalLinkProps) => (
  <a
    target={props.target || "_blank"}
    rel={props.rel || "noopener noreferrer"}
    {...props}
  >
    {props.children}
  </a>
);

export default ExternalLink;
