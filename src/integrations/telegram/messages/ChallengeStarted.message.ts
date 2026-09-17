import { ChallengesQueryItem } from 'modules/challenges/challenges.types';
import { PositionQuery } from 'modules/positions/positions.types';
import { escapeMd, formatCurrency, liqPriceNumber, shortenString, tokenAmountNumber } from 'utils/format';
import { AppUrl, ExplorerAddressUrl } from 'utils/func-helper';

export function ChallengeStartedMessage(position: PositionQuery, challenge: ChallengesQueryItem): string {
	const size = tokenAmountNumber(challenge.size, position.collateralDecimals);
	const min = tokenAmountNumber(position.minimumCollateral, position.collateralDecimals);
	const price = liqPriceNumber(challenge.liqPrice, position.collateralDecimals);
	const duration = parseInt(challenge.duration.toString()) * 1000;

	const startMs = parseInt(challenge.start.toString()) * 1000;
	const expirationVirtual = startMs + 2 * duration;
	const expirationPosition = position.expiration * 1000;
	const isQuickAuction = expirationVirtual > expirationPosition;
	const expirationFinal = Math.min(expirationVirtual, expirationPosition);
	const phase1End = isQuickAuction ? undefined : startMs + duration;

	const sym = escapeMd(position.collateralSymbol);
	const name = escapeMd(position.collateralName);

	return `⚔️ *Challenge Started*

#${challenge.number} on \`${shortenString(position.position)}\` (v${position.version})
⚡ Quick Auction: *${isQuickAuction ? 'Yes' : 'No'}*

⚔️ Challenger: \`${shortenString(challenge.challenger)}\`
👤 Owner: \`${shortenString(position.owner)}\`

💎 Collateral: *${name} (${sym})*
   Size: *${formatCurrency(size, 2, 2)} ${sym}* (min *${formatCurrency(min, 2, 2)}*)
   Starting Price: *${formatCurrency(price, 2, 2)} ZCHF*
   Duration: *${formatCurrency(duration / 1000 / 3600, 1, 1)} hours*

📅 Phase 1 End: *${phase1End ? new Date(phase1End).toUTCString() : 'N/A (quick auction)'}*
📅 Phase 2 End: *${new Date(expirationFinal).toUTCString()}*

[💸 Buy in Auction](${AppUrl(`/monitoring/${position.position}/auction/${challenge.number}`)}) · [📋 Position](${AppUrl(`/monitoring/${position.position}`)})
[🔍 Challenger](${ExplorerAddressUrl(challenge.challenger)}) · [🔍 Position](${ExplorerAddressUrl(position.position)})`;
}
