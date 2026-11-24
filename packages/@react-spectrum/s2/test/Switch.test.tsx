/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {pointerMap, render} from '@react-spectrum/test-utils-internal';
import React from 'react';
import {Switch} from '../src/Switch';
import userEvent from '@testing-library/user-event';

describe('Switch', () => {
  let user;
  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
  });

  it('can be focused with Tab and toggled with Space', async () => {
    let onChange = jest.fn();
    let {getByRole} = render(<Switch onChange={onChange}>Wi-Fi</Switch>);

    let input = getByRole('switch', {name: 'Wi-Fi'});
    expect(input).not.toBeChecked();

    await user.tab();
    expect(document.activeElement).toBe(input);

    await user.keyboard(' ');
    expect(input).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);

    await user.keyboard(' ');
    expect(input).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('does not toggle on Enter, matching native switch and checkbox behavior', async () => {
    let onChange = jest.fn();
    let {getByRole} = render(<Switch onChange={onChange}>Wi-Fi</Switch>);

    let input = getByRole('switch');
    await user.tab();
    expect(document.activeElement).toBe(input);

    await user.keyboard('{Enter}');
    expect(input).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps keyboard focus on the switch after toggling', async () => {
    let {getByRole} = render(<Switch>Wi-Fi</Switch>);

    let input = getByRole('switch');
    await user.tab();
    await user.keyboard(' ');
    expect(document.activeElement).toBe(input);
  });

  it('reports the new value to onChange but waits for the parent when controlled', async () => {
    let onChange = jest.fn();
    let {getByRole} = render(
      <Switch isSelected={false} onChange={onChange}>
        Wi-Fi
      </Switch>
    );

    let input = getByRole('switch');
    await user.tab();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
    expect(input).not.toBeChecked();
  });

  it('skips disabled switches when tabbing and ignores Space', async () => {
    let onChange = jest.fn();
    let {getByRole} = render(
      <>
        <Switch isDisabled onChange={onChange}>
          Disabled
        </Switch>
        <Switch onChange={onChange}>Enabled</Switch>
      </>
    );

    let disabled = getByRole('switch', {name: 'Disabled'});
    let enabled = getByRole('switch', {name: 'Enabled'});
    expect(disabled).toBeDisabled();

    await user.tab();
    expect(document.activeElement).toBe(enabled);

    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(disabled).not.toBeChecked();
  });

  it('stays focusable but does not toggle with Space when read only', async () => {
    let onChange = jest.fn();
    let {getByRole} = render(
      <Switch isReadOnly defaultSelected onChange={onChange}>
        Wi-Fi
      </Switch>
    );

    let input = getByRole('switch');
    expect(input).toHaveAttribute('aria-readonly', 'true');

    await user.tab();
    expect(document.activeElement).toBe(input);

    await user.keyboard(' ');
    expect(input).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });
});
