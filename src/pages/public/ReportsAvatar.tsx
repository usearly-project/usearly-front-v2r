import Avatar from "@src/components/shared/Avatar";
import "./ReportAvatars.scss";

type User = {
  id: string;
  pseudo: string;
  avatar: string | null;
};

type Props = {
  users: User[];
};

const ReportAvatars = ({ users }: Props) => {
  const visibleUsers = users.slice(0, 3);

  return (
    <div className="signalement-avatars">
      <div className="avatars-group">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="mini-avatar-wrapper"
            title={user.pseudo}
          >
            <Avatar avatar={user.avatar} pseudo={user.pseudo} sizeHW={22} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReportAvatars;
