'use client';

import React, { useState } from 'react';
import { WindowTitleBar } from '@/components/Rad_os/WindowTitleBar';

// ============================================================================
// Section Component
// ============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3
        className="mb-3 border-b border-black/20 pb-2"
      >
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function PropsDisplay({ props }: { props: string }) {
  return (
    <code className="bg-black/5 px-2 py-1 rounded-sm block mt-2">
      {props}
    </code>
  );
}

function Row({ children, props }: {
  children: React.ReactNode;
  props?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
      </div>
      {props && <PropsDisplay props={props} />}
    </div>
  );
}


// ============================================================================
// Preview Content
// ============================================================================

function WindowTitleBarContent() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="p-4 border border-black bg-[var(--color-cream)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Basic Usage
        </h3>
        <div className="flex flex-col gap-4">
          <WindowTitleBar
            title="My Application"
            windowId="my-app"
            onClose={() => setIsOpen(false)}
            data-edit-scope="component-definition"
            data-component="WindowTitleBar"
          />
          <PropsDisplay props='title: string, windowId: string, onClose: () => void' />
          <WindowTitleBar
            title="With Icon"
            windowId="my-app-icon"
            onClose={() => setIsOpen(false)}
            iconName="home"
          />
          <PropsDisplay props='iconName?: string' />
        </div>
      </div>

      <div className="p-4 border border-black bg-[var(--color-cream)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Visibility Controls
        </h3>
        <div className="flex flex-col gap-4">
          <WindowTitleBar
            title="Hidden Title"
            windowId="no-title"
            onClose={() => {}}
            showTitle={false}
          />
          <PropsDisplay props='showTitle={false}' />
          <WindowTitleBar
            title="No Copy Button"
            windowId="no-copy"
            onClose={() => {}}
            showCopyButton={false}
          />
          <PropsDisplay props='showCopyButton={false}' />
          <WindowTitleBar
            title="No Close Button"
            windowId="no-close"
            onClose={() => {}}
            showCloseButton={false}
          />
          <PropsDisplay props='showCloseButton={false}' />
          <WindowTitleBar
            title="Minimal"
            windowId="minimal"
            onClose={() => {}}
            showTitle={false}
            showCopyButton={false}
            showCloseButton={false}
          />
          <PropsDisplay props='showTitle={false}, showCopyButton={false}, showCloseButton={false}' />
          <WindowTitleBar
            title="With Fullscreen"
            windowId="with-fullscreen"
            onClose={() => {}}
            showFullscreenButton={true}
            onFullscreen={() => alert('Fullscreen clicked!')}
          />
          <PropsDisplay props='showFullscreenButton={true}, onFullscreen: () => void' />
        </div>
      </div>

      <div className="p-4 border border-black bg-[var(--color-cream)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Help Button
        </h3>
        <div className="flex flex-col gap-4">
          <WindowTitleBar
            title="With Help"
            windowId="with-help"
            onClose={() => {}}
            showHelpButton={true}
            helpContent={
              <div>
                <p className="mb-2">This is the help content.</p>
                <p>
                  You can add any React content here to help users understand how to use this window.
                </p>
              </div>
            }
            helpTitle="Window Help"
          />
          <PropsDisplay props='showHelpButton={true}, helpContent: React.ReactNode, helpTitle?: string' />
          <WindowTitleBar
            title="Default Help"
            windowId="default-help"
            onClose={() => {}}
            showHelpButton={true}
          />
          <PropsDisplay props='showHelpButton={true} (default help content)' />
        </div>
      </div>

      <div className="p-4 border border-black bg-[var(--color-cream)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Action Button
        </h3>
        <div className="flex flex-col gap-4">
          <WindowTitleBar
            title="With Action Button"
            windowId="with-action"
            onClose={() => {}}
            showActionButton={true}
            actionButton={{
              text: "Connect Wallet",
              onClick: () => alert('Wallet connect clicked!'),
            }}
          />
          <PropsDisplay props='showActionButton={true}, actionButton: ActionButtonConfig' />
          <WindowTitleBar
            title="External Link"
            windowId="external-link"
            onClose={() => {}}
            showActionButton={true}
            actionButton={{
              text: "Visit Site",
              href: "https://example.com",
              target: "_blank",
            }}
          />
          <PropsDisplay props='actionButton with href' />
          <WindowTitleBar
            title="With Icon"
            windowId="with-icon"
            onClose={() => {}}
            showActionButton={true}
            actionButton={{
              text: "Download",
              iconName: "download",
              onClick: () => alert('Download clicked!'),
            }}
          />
          <PropsDisplay props='actionButton with icon' />
        </div>
      </div>

      <div className="p-4 border border-black bg-[var(--color-cream)] rounded flex flex-col gap-4 mb-4">
        <h3>
          All Features Combined
        </h3>
        <div className="flex flex-col gap-4">
          <WindowTitleBar
            title="Full Featured"
            windowId="full-featured"
            onClose={() => {}}
            showHelpButton={true}
            showActionButton={true}
            helpContent={
              <div>
                <p className="mb-2">Complete Help Guide</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This window has all features enabled</li>
                  <li>Help button opens contextual help</li>
                  <li>Action button performs custom actions</li>
                  <li>Copy button shares the window link</li>
                </ul>
              </div>
            }
            helpTitle="Complete Guide"
            actionButton={{
              text: "Get Started",
              iconName: "lightning",
              onClick: () => alert('Get started clicked!'),
            }}
          />
          <PropsDisplay props='All optional props enabled' />
        </div>
      </div>

      <div className="p-4 border border-black bg-[var(--color-cream)] rounded flex flex-col gap-4 mb-4">
        <h3>
          Custom Styling
        </h3>
        <div className="flex flex-col gap-4">
          <WindowTitleBar
            title="Custom Styled"
            windowId="custom-styled"
            onClose={() => {}}
            className="bg-sun-yellow/20"
          />
          <PropsDisplay props='className: string' />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Export
// ============================================================================

export default function Preview() {
  return (
    <div className="space-y-6">
      <WindowTitleBarContent />
    </div>
  );
}

