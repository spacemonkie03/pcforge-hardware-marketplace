import { ReactNode } from 'react';
import { Layout } from './Layout';
import { ButtonPrimary } from './ui/ButtonPrimary';
import { ButtonSecondary } from './ui/ButtonSecondary';
import { Card } from './ui/Card';
import { SectionContainer } from './ui/SectionContainer';

interface PageAction {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
}

interface ContentPageProps {
  title: string;
  description: string;
  actions?: PageAction[];
  children: ReactNode;
}

export const ContentPage = ({ title, description, actions = [], children }: ContentPageProps) => {
  return (
    <Layout>
      <SectionContainer
        title={title}
        description={description}
        actions={
          actions.length > 0 ? (
            <>
              {actions.map((action) =>
                action.variant === 'secondary' ? (
                  <ButtonSecondary key={action.href + action.label} href={action.href}>
                    {action.label}
                  </ButtonSecondary>
                ) : (
                  <ButtonPrimary key={action.href + action.label} href={action.href}>
                    {action.label}
                  </ButtonPrimary>
                )
              )}
            </>
          ) : undefined
        }
      >
        <Card className="p-6 md:p-8">{children}</Card>
      </SectionContainer>
    </Layout>
  );
};
