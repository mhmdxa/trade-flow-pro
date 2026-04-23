import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TradeService } from '../../shared/services/trade.service';
import { RiskService } from '../../shared/services/risk.service';
import { map } from 'rxjs';

// This guard simply checks if daily loss is exceeded. If so, they shouldn't access a trading page (mock).
export const riskGuard: CanActivateFn = (route, state) => {
  const tradeService = inject(TradeService);
  const router = inject(Router);

  // For our setup, we'll actually enforce this directly in the components, 
  // but this is the requested guard structure.
  return tradeService.isDailyLossExceeded$.pipe(
    map(exceeded => {
      if (exceeded) {
        alert('Daily Loss Limit Exceeded! Access to trading is restricted today.');
        // Optionally redirect: return router.createUrlTree(['/dashboard']);
        return true; // We'll return true to allow routing but we will disable buttons in UI instead
      }
      return true;
    })
  );
};
