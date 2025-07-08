revoke insert (template) on "public"."documents"
from
  "authenticated";

revoke
update (template) on "public"."documents"
from
  "authenticated";

alter table "public"."documents"
drop column "template";
